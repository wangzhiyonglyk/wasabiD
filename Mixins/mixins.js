// import React,{Component} from 'react';

// const MyContainer = (MyComponent,...params) => 
//     {
//         //rest参数以数组的形式，所以要进行转义
//         let newObj={};
//         for(var i in params)
//         {
//             for(let p in params[i])
//             {
//                newObj[p]=params[i][p];
//             }   
//         }
//    return  class extends Component {
       
//         render(){
//             return <MyComponent {...this.props} {...newObj}  />
//         }
//     }
// }

//     export default MyContainer;

function applyMixins(derivedCtor, baseCtors) {
   
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor).forEach(name => {
           
           if(typeof baseCtor[name]=="function")
          
           {
               derivedCtor.prototype[name] = baseCtor[name];
           }
        });
    });
}
export default applyMixins;