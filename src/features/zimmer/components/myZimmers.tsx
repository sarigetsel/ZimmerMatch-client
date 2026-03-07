import { useState } from 'react';
import { useSelector } from 'react-redux';
import {type RootState } from '../../../app/store';
import { useGetZimmersQuery, useDeleteZimmerMutation } from '../../zimmer/redux/zimmerApi';
import ZimmerCard from './zimmerCard/zimmerCard';
import { AddZimmer } from './addZimmer/addZimmer';
import {type Zimmer } from '../redux/zimmerSlice';

const MyZimmers = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { data: zimmers, isLoading, error } = useGetZimmersQuery();
  const [deleteZimmer] = useDeleteZimmerMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingZimmer, setEditingZimmer] = useState<Zimmer | null>(null);

  const handleEdit = (zimmer: Zimmer) => {
    setEditingZimmer(zimmer);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את הצימר?");
    if (!confirmDelete) return;

    try {
      await deleteZimmer(id).unwrap();
      alert("הצימר נמחק בהצלחה");
    } catch {
      alert("שגיאה במחיקת הצימר");
    }
  };

  if (!currentUser || currentUser.role !== 'Owner') {
    return <div>גישה חסומה – דף זה מיועד לבעלי צימרים בלבד.</div>;
  }

  if (isLoading) return <div>טוען צימרים...</div>;
  if (error) return <div>שגיאה בטעינת הנתונים</div>;

 
  const myZimmers = zimmers?.filter(z => z.ownerId === currentUser.id);

  

  return (
    <div>
      <h2>הצימרים שלי</h2>
      {!showAddForm && <button onClick={() => setShowAddForm(true)}>הוסף צימר חדש</button>}
      {showAddForm && (
       <AddZimmer
         onClose={() => {
           setShowAddForm(false);
           setEditingZimmer(null);
        }}
        existingZimmer={editingZimmer || undefined}
         />
        )}
      
      <div className="zimmer-list-container">
        {myZimmers?.map(z => (
          <ZimmerCard
            key={z.zimmerId}
            zimmer={z}
            showActions={true}
            onEdit={() => handleEdit(z)}
            onDelete={() => handleDelete(z.zimmerId)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyZimmers;