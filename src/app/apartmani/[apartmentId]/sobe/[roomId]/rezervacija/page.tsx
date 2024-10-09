const ReservationPage = ({
  params,
}: {
  params: { apartmentId: string; roomId: string };
}) => {
  const { apartmentId, roomId } = params;
  return (
    <div>
      <div>Reservation page!</div>
      <div>
        Apartman: <strong>{apartmentId}</strong>
      </div>
      <div>
        Soba: <strong>{roomId}</strong>
      </div>
    </div>
  );
};

export default ReservationPage;
