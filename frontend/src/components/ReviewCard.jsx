import React from "react";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
    const { name, rating, comment, createdAt } = review;
    return (
        <div className="bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">{name}</h4>
                <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }, (_, idx) => (
                        <Star
                            key={idx}
                            size={16}
                            className={idx < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                    ))}
                </div>
            </div>
            {comment && <p className="text-gray-600 dark:text-gray-300 mb-2">{comment}</p>}
            {createdAt && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
            )}
        </div>
    );
};

export default ReviewCard;
