import { useGetZimmersQuery, useDeleteZimmerMutation } from "../../zimmer/redux/zimmerApi";

const ZimmerManagement = () => {

  const { data: zimmers, isLoading } = useGetZimmersQuery();
  const [deleteZimmer] = useDeleteZimmerMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>שם</th>
          <th>עיר</th>
          <th>מחיר</th>
          <th>פעולות</th>
        </tr>
      </thead>
      <tbody>
        {zimmers?.map(z => (
          <tr key={z.zimmerId}>
            <td>{z.nameZimmer}</td>
            <td>{z.city}</td>
            <td>{z.pricePerNight}</td>
            <td>
              <button onClick={() => deleteZimmer(z.zimmerId)}>מחק</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ZimmerManagement;