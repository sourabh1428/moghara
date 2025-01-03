import React, { useEffect } from 'react';
import { supabase } from '../Supabase/index';

export const Order = () => {
  async function updateDataInTable() {
    try {
      // Update all rows with a dummy condition
      const { data, error } = await supabase
        .from('Products') // Table name
        .update({ product_type: 'Plumber' }) // Set product_type to 'Plumber'
        .neq('id', 0); // Dummy condition to satisfy the WHERE clause
      
      if (error) {
        console.error('Error updating data:', error);
      } else {
        console.log('Updated data:', data);
      }
    } catch (e) {
      console.error('Failed to connect to Supabase:', e);
    }
  }

  useEffect(() => {

  }, []);

  return <div>
        
        
        
        Order
    
    
    
    </div>;
};
