export default function TrackTable() {
  return (
    <table className="text-md text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" className="p-4">
                    <div className="flex items-center">
                        select
                    </div>
                </th>
                <th scope="col" className="py-3 px-6">Title</th>
                <th scope="col" className="py-3 px-6">Link</th>
            </tr>
        </thead>
        <tbody>
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4 w-4">
                    <div className="flex items-center">
                        <input type="checkbox"/>
                    </div>
                </td>
                <td scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </td>
                <td className="py-4 px-6">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Download</a>
                </td>
            </tr>
        </tbody>
    </table>
  )}