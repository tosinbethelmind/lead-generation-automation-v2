import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="service-card p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 transition-transform transform hover:scale-105">
      <div className="icon text-4xl mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};
