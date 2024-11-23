import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const TestimonialCard = ({ 
    customerName, 
    customerCompany, 
    customerSocialId, 
    customerReview, 
    customerPosition, 
    avatarUrl, 
    rating 
}) => {
  // const handleDelete = async ({userId,testimonialId}) => {
  //   const res = await axios.delete('/api/testimonials/delete', {
  //     data: { userId, testimonialId }
  //   })
  // }
    return (
        <div className="rounded-lg text-white flex flex-col">
            <div className="flex items-center mb-4">
                <Image 
                    src={avatarUrl || "/default-avatar.png"} 
                    alt={customerName} 
                    width={50} 
                    height={50} 
                    className="rounded-full mr-3"
                />
                <div>
                    <h3 className="text-lg font-semibold">{customerName}</h3>
                    <p className="text-sm italic">{customerPosition} at {customerCompany}</p>
                    <p className="text-xs text-gray-300">@{customerSocialId}</p>
                </div>
            </div>
            <p className="mb-4">{customerReview}</p>
            <div className="flex">
                {rating && [...Array(rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                ))}
            </div>
        </div>
    );
};

export default TestimonialCard;