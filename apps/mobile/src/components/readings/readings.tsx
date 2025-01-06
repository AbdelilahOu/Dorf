function Readings({ data }: { data: any }) {
  return (
    <div className="flex w-full flex-col space-y-2">
      {data.map((reading: any) => (
        <div key={reading.id}>
          {reading.id}-{reading.amount}
        </div>
      ))}
    </div>
  );
}

export default Readings;
