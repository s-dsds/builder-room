function getFuncDoc(func) {
    let ret = {
     main_doc: '',
        params:[]
    }
     const ARG_META = /([\s\/=]+.*)/g;
     const MAIN_COMMENT = /\)\s*\/\*(.*)\*\/\s*{/g;
     const COMMENT = /\/\*(.*)\*\//g;
     const DEF = /=(.*)/g;
     const fnStr = func.toString();
     ret.main_doc = fnStr.match(MAIN_COMMENT)&& fnStr.match(MAIN_COMMENT).length>0?fnStr.match(MAIN_COMMENT)[0].replace(/(^\)\s*\/\*|\*\/\s*{$)/g,'').trim():null;
   
     let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'));
     if (result=="")
         return ret
     result = result.split(',')
     if(result === null)
        return ret;
        
     ret.params= result.map((v) => {
         v = v.trim()
         let name = v.replace(ARG_META,'').trim();
         if (name=='map') return null;
        return {
                name: name,
            doc: v.match(COMMENT)&& v.match(COMMENT).length>0?v.match(COMMENT)[0].trim().replace(/[\/\*]/g,'').trim():null,
            default:v.match(DEF)&& v.match(DEF).length>0?v.match(DEF)[0].split('=').pop().replace(ARG_META,'').trim():null
        }
     }).filter(n => n);
     return ret
   }
//    {
//     main_doc: "prout",
//     params: [{
//     default: null,
//     doc: "pouet",
//     name: "p1"
//   }, {
//     default: "null",
//     doc: null,
//     name: "p2"
//   }]
//   }
function fxDoc() {
    return effectList.map((n)=> {
        let d = getFuncDoc(effects[n])
        let ret = [`!fx ${n}`+(d.main_doc?` : ${d.main_doc}`:'')]
        if (d.params.length) {
            ret.push(`params: !fx ${n}#`+d.params.reduce((a,e)=>{ a.push(e.name); return a},[]).join('#'))
            d.params.forEach(e => {
                ret.push(`- ${e.name}`+(e.doc?` : ${e.doc}`:'')+(e.default?` (default value: ${e.default})`:''))
            });
        }
        return ret
    })   
}