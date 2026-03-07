import { useGetZimmersQuery } from "../../redux/zimmerApi";
import ZimmerCard from '../zimmerCard/zimmerCard'
import './zimmerList.css';

const ZimmerList = () => {
    const { data: zimmers, isLoading, error } = useGetZimmersQuery();

    if (isLoading) return <div className="loading-message"> טוען צימרים...</div>;
    if (error) return <div className="error-message">שגיאה בטעינת הנתונים</div>;

    return (
      <div className="zimmer-list-container"> 
      {zimmers?.map((zimmer) => (
        <ZimmerCard key={zimmer.zimmerId} zimmer={zimmer} />
      ))}
      </div>
    );
};
export default ZimmerList;