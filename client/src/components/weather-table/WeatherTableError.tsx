export function WeatherTableError({ colSpan }: Readonly<{ colSpan: number }>) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-6 py-12 text-center text-sm text-red-700"
      >
        Could not load weather records. Please try again.
      </td>
    </tr>
  );
}
