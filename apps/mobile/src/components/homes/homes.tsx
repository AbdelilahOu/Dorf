function Homes({ data }: { data: any }) {
  if (!data) return <></>;

  return (
    <div className="flex w-full flex-col space-y-2">
      {data.map((home: any) => (
        <div key={home.id}>
          {home.id}-{home.amount}
        </div>
      ))}
    </div>
  );
}

export default Homes;
