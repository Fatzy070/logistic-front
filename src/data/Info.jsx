import { link } from "framer-motion/client";
import { 
  TbTruck,          // Create Shipment
  TbTruckLoading,        // Track Shipment
  TbPackage,        // Get Shipment/All Shipments
 TbTruckDelivery ,     
 TbLocationFilled
} from "react-icons/tb";
import { RiHome6Line } from "react-icons/ri";
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";


const Info = {
  nav: [
    { id: 1,  name:'Dashboard' , link:'/'} ,
    { id: 2 ,  name:'My Shipments' , link:'/shipments'} ,
    { id: 3 ,  name:'Create Shipment' , link:'/create-shipment'} ,
    { id: 3 ,  name:'Track' , link:'/'} ,
    // { id: 3 ,  name:'Profile' , link:'/'} ,
  ],
  adminNav: [
    { id: 1,  name:'Dashboard' , link:'/'} ,
    { id: 2 ,  name:'Shipments' , link:'/shipments'} ,
    { id: 3 ,  name:'Riders' , link:'/'} ,
    { id: 4 ,  name:'Users' , link:'/'} ,
    { id: 5 , name:'Create Shipment' , link:'/create-shipment'} ,
  ] ,
  logi:"LogiXpress",
  navIcon:[
    { id: 1 , icon: RiHome6Line  , link:'/'} ,
    { id: 2 , icon: TbTruckDelivery  , link:'/'} ,
    { id: 3 , icon: TbTruckLoading , link:'/'} ,
    { id: 4 , icon: TbLocationFilled  , link:'/'} ,
    { id: 4 , icon: IoNotificationsOutline   , link:'/'} ,
  ]
};

export default Info;