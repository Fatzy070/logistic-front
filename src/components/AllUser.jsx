import React, { useEffect, useState } from 'react';
import api from '../context/api';

const AllUser = () => {
     const [ users , setUser ] = useState([])
     const [ message , setMessage ] = useState('')
     useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get(`/users`)

                setUser(res.data.users)

            } catch (error) {
                comsole.error('Error fetching users:' , error.message || error)
                setMessage(error.response?.data.message || 'Error fetching users')
            }
        }
        fetchUsers();
     },)

     const deleteUser = async (id) => {
        try {
            const res = await api.delete(`/user/${id}`)
            setMessage(res.data.message)
        } catch (error) {
            console.error('Error deleting user:' , error.message || error)
            setMessage(error.response?.data.message || 'Error deleting user')
        }
     }

    return (
        <div>
            {message && <p className="mb-4 text-2xl text-center text-red-500">{message}</p>}
            <h1 className="text-3xl font-bold mb-6">All Users</h1>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (   
                <ul>
                    {users.map((user) => (
                        <li key={user._id} className="mb-4 flex justify-between items-center p-4 border rounded shadow">
                            <div>
                                <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            </div>
                           <div>
                             <button
                            className='border rounded text-red-600 px-2 py-1 '
                            onClick={() => deleteUser(user._id)}>delete</button>
                           </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AllUser;