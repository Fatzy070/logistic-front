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
import { 
  PlusCircle, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Weight, 
  DollarSign, 
  MessageSquare,
  Truck
} from 'lucide-react';
import { FiUser } from "react-icons/fi";

const Info = {
  nav: [
    { id: 1,  name:'Dashboard' , link:'/'} ,
    { id: 2 ,  name:'My Shipments' , link:'/shipments'} ,
    { id: 3 ,  name:'Create Shipment' , link:'/create-shipment'} ,
    { id: 3 ,  name:'Track' , link:'/track'} ,
    // { id: 3 ,  name:'Profile' , link:'/'} ,
  ],
  adminNav: [
    { id: 1,  name:'Dashboard' , link:'/'} ,
    { id: 2 ,  name:'Shipments' , link:'/all-shipments'} ,
    { id: 3 ,  name:'Riders' , link:'/'} ,
    { id: 4 ,  name:'Users' , link:'/user'} ,
    { id: 5 , name:'Create Shipment' , link:'/create-shipment'} ,
    { id: 5 , name:'Track' , link:'/track'} ,
  ] ,
  logi:"LogiXpress",
  navIcon:[
    { id: 1 , icon: RiHome6Line  , link:'/'} ,
    { id: 2 , icon: TbTruckDelivery  , link:'/shipments'} ,
    { id: 3 , icon: TbTruckLoading , link:'/create-shipment'} ,
    { id: 4 , icon: TbLocationFilled  , link:'/'} ,
    { id: 4 , icon: IoNotificationsOutline   , link:'/'} ,
  ] ,
  adminavIcon:[
    { id: 1 , icon: RiHome6Line  , link:'/'} ,
    { id: 2 , icon: TbTruckDelivery  , link:'/shipments'} ,
    { id: 3 , icon: TbTruckLoading , link:'/create-shipment'} ,
    { id: 4 , icon: TbLocationFilled  , link:'/track'} ,
    { id: 4 , icon: IoNotificationsOutline   , link:'/'} ,
    { id: 4 , icon: FiUser  , link:'/user'} ,
  ] ,
 inputFields: [
    { name: 'senderName', placeholder: 'Sender Full Name', icon: User,required: true },
    { name: 'receiverName', placeholder: 'Receiver Full Name', icon: User, required: true },
    { name: 'receiverPhone', placeholder: 'Receiver Phone (11 digits)', icon: Phone, type: 'tel',required: true },
    { name: 'pickupAddress', placeholder: 'Pickup Address', icon: MapPin,required: true },
    { name: 'deliveryAddress',   placeholder: 'Delivery Address',   icon: MapPin,  required: true },
    { name: 'packageType',   placeholder: 'Package Type (e.g., Document, Box, Fragile)',   icon: Package,  required: true },
    {   name: 'weight',   placeholder: 'Weight (kg)',   icon: Weight,  type: 'number',  step: '0.01',  required: true },{   name: 'price',   placeholder: 'Price (₦)',   icon: DollarSign,  type: 'number',  required: true },
    { name: 'note', placeholder: 'Special Instructions (Optional)', icon: MessageSquare,isTextarea: true 
     }
      ]
};

export default Info;