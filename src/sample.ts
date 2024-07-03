// const subtract = (a:number,b:number) => {
//     console.log(a-b);
// }
// subtract(5,2);

const display = (name:string|number|object) => {
    console.log(name);
}
display({id:100} as unknown as string);
let numberArr:Number[]=[1,2,3];
let stringArr:string[]=["hello"];
console.log(numberArr);
console.log(stringArr);


type carType={
    type:string,
    model:string,
    year?:number
}
const car:carType[]=[
    {
        type:"Toyota",
        model:"Innova",
        year:2000
    },
    {
        type:"Toyota",
        model:"camry",
    },
]
console.log(car);
// use interface for interface
const sum=(a:number,b:number):number => {   //specify type of return after closing bracket
    return a+b;
}

type sumType=(a:number, b:number)=>void