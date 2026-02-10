import { useEffect, useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';
import supabase from '../../supabase.config';

const SalesHistory = ({ currentStore }) => { // Récupération du magasin via les props
  const [localSales, setLocalSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!currentStore?.id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_carts')
        .select(`
          id, 
          amount, 
          date, 
          inventory_stores(store_name), 
          inventory_orders(*)
        `)
        .eq('store_id', currentStore.id) // Filtrage par magasin
        .order('date', { ascending: false })
        .limit(10);
        
      if (!error) {
        setLocalSales(data);
      }
      setLoading(false);
    };
    
    loadHistory();
  }, [currentStore]); // Se recharge dès que le magasin change dans le Dashboard

  if (loading) return <div className="no-data-msg">{"Chargement de l'historique..."}</div>;
  if (!localSales || localSales.length === 0) {
    return <div className="no-data-msg">Aucune transaction pour ce magasin.</div>;
  }

  return (
    <div className="sales-history-card">
      <h4>Ventes Récentes - {currentStore?.store_name}</h4>
      <table className="history-table">
        <thead>
          <tr>
            <th>Heure</th>
            <th>Articles</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {localSales.map((sale) => (
            <tr key={sale.id}>
              <td>{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{sale.inventory_orders?.length || 0} produits</td>
              <td className="amount-cell">{sale.amount} $</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SalesHistory.propTypes = {
  currentStore: PropTypes.object
};

export default SalesHistory;