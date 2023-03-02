
/*

let value = [
  {
    id:'4242424',
    name:'Frying Pan',
    type:"Cookware",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/fryingpan.png",
    image:"Utensils/fryingpan.png",
    link:'/utensilsdetails'
  },

  {
    id:'535353',
    name:'Ladle',
    type:"Utensils",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/ladle.png",
    image:"Utensils/ladle.png",
    link:'/utensilsdetails'
  },

  {
    id:'856464',
    name:'Wooden Spatula',
    type:"Cookware",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/woodenspatula.png",
    image:"Utensils/woodenspatula.png",
    link:'/utensilsdetails'
  },

  {
    id:'53657676',
    name:'Pressure Cooker',
    type:"Appliances",
    about:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores rem cupiditate minima. Vel temporibus non optio provident accusantium in aperiam labore, error mollitia ut sint velit ipsum et voluptates dolores.`,
    coverimage:"Utensils/pressurecooker.png",
    image:"Utensils/pressurecooker.png",
    link:'/utensilsdetails'
  },

]
*/
/*
const cookingutensils = value.map((val)=>{

return ({...val,link:`/utensildetails/${val.id}`})
})

  document.getElementById('document').innerText = JSON.stringify(cookingutensils[3]).slice(1,-1)

  */


let value = [ {
  name:'David Samuel',
  email:'daniel@gmail.com',
  coverimage:'Images/infographic.png',
  image:'Images/infographic.png',
  favouriteItems:{
    procurers:['3264743252'],
    ingredients:['3264422','32323642','32423132'],
    equipments:['3234242','564242','323532'],
    recipes:['433t5y3','64864445','3y5y563'],
    },
    cartKeys:[],
    chatRooms:[],
    cartItems1:[],
  cartItems:[],
  notifications:[
    {message:'Your order has been delivered',mode:'success'}],

  orderInformation:[{procurerId:`63869bf69d53fd13bc797d92`,orderId:'1213242',completed:true}]
,
  coordinates:[],
  location:[]
}
]




document.getElementById('document').innerText = JSON.stringify(value[0]).slice(1, -1)
