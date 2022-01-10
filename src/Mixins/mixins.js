/**
 * 2020-11-07edit 此方法要改
 * @param {*} derivedCtor 
 * @param {Array} baseCtors 
 */
function applyMixins(derivedCtor, baseCtors) {
   
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor).forEach(name => {
           
           if(typeof baseCtor[name]=="function")
          
           {
               derivedCtor.prototype[name] = baseCtor[name];
           }
        });
    });
    return derivedCtor;
}
export default applyMixins;