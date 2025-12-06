import axios from 'axios';
import React, { useState } from 'react';
import api from '../context/api';
const CreateShipment = () => {
    const [ senderName , setSenderName ] = useState('')
    const [ receiverName , setReceiverName ] = useState('')
    const [ receiverPhone , setReceiverPhone ] = useState('')
    const [ pickupAddress , setPickupAddress ] = useState('')
    const [ deliveryAddress , setDeliveryAddress ] = useState('')
    const [ packageType , setPackageType ] = useState('')
    const [ weight , setWeight ] = useState('')
    const [ price , setPrice ] = useState('')
    const [ note , setNote ] = useState('')
    const [ message , setMessage ] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token');
        try {
            const res = await api.post(`http://localhost:3000/api/shipments` , {
                senderName,
                receiverName,
                receiverPhone,
                pickupAddress,
                deliveryAddress,
                packageType,
                weight,
                price,
                note
            }, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })

            setMessage(res.data.message)
        } catch (error) {
           console.log('Error creating shipment:', error.message || error);
           setMessage(error.response?.data.message || 'Error creating shipment'); 
        }
    }

    return (
        <div>
            {message && <p className="mb-4 text-2xl text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
            <div>
                <input 
               type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className='border'
                placeholder='sender name'
             />
            </div>
            <div>
                <input 
               type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className='border'
                placeholder='receiver name'
             />
            </div>
            <div>
                <input 
               type="number"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                className='border'
                placeholder='receiver Phone number'
             />
            </div>
            <div>
                <input 
               type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className='border'
                placeholder='pick up address'
             />
            </div>
            <div>
                <input 
               type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className='border'
                placeholder='delivery address'
             />
            </div>
            <div>
                <input 
               type="text"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                className='border'
                placeholder='package type'
             />
            </div>
            <div>
                <input 
               type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className='border'
                placeholder='weight'
             />
            </div>
            <div>
                <input 
               type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='border'
                placeholder='price'
             />
            </div>
            <div>
                <input 
               type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='border'
                placeholder='note'
             />
            </div>

            <button type='submit'>Create</button>
        </form>

        </div>
    );
};

export default CreateShipment;