import { useNavigate } from "react-router-dom";

const SidePanel = ({ user, activeSideTab, setShowSidePanel, setActiveSideTab, showSidePanel, logs }) => {

    const navigate = useNavigate();
    return (
        <>
            <button
                onClick={() => setShowSidePanel(!showSidePanel)}
                className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all z-50"
                style={{
                    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                }}
            >
                {showSidePanel ? "Close Panel" : "Open Panel"}
            </button>

            {/* Side Panel for Recent Activity & Quick Actions */}
            {showSidePanel && (
                <div
                    className="fixed top-20 right-8 w-80 h-[70%] rounded-xl p-4 overflow-auto z-40"
                    style={{
                        background: "#e0e0e0",
                        boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                    }}
                >
                    <div className="flex justify-around mb-4">
                        <button
                            onClick={() => setActiveSideTab("recent")}
                            className={`px-3 py-1 rounded-md ${activeSideTab === "recent" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                            style={{
                                boxShadow: activeSideTab === "recent" ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" : "",
                            }}
                        >
                            Recent Activity
                        </button>
                        <button
                            onClick={() => setActiveSideTab("quick")}
                            className={`px-3 py-1 rounded-md ${activeSideTab === "quick" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                            style={{
                                boxShadow: activeSideTab === "quick" ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" : "",
                            }}
                        >
                            Quick Actions
                        </button>
                    </div>

                    {activeSideTab === "recent" && (
                        <div>
                            <h3 className="text-lg text-gray-800 mb-2">Recent Activity</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-2 py-1 text-sm text-center">Date</th>
                                        <th className="px-2 py-1 text-sm text-center">Item</th>
                                        <th className="px-2 py-1 text-sm text-center">Action</th>
                                        <th className="px-2 py-1 text-sm text-center">Qty</th>
                                        <th className="px-2 py-1 text-sm text-center">Buyer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.slice(0, 5).map((log, index) => {
                                        const quantityValue = log.quantity_added || log.quantity_sold || log.quantity || "N/A";
                                        const buyerName =
                                            log.buyer && log.buyer.trim() !== ""
                                                ? log.buyer
                                                : log.company && log.company.trim() !== ""
                                                    ? log.company
                                                    : "n/a";
                                        const dateValue = log.timestamp
                                            ? new Date(log.timestamp).toLocaleString()
                                            : log.date_alloted
                                                ? new Date(log.date_alloted).toLocaleString()
                                                : log.date_returned
                                                    ? new Date(log.date_returned).toLocaleString()
                                                    : "N/A";
                                        return (
                                            <tr key={index} className="border-b">
                                                <td className="px-2 py-1 text-xs text-center">{dateValue}</td>
                                                <td className="px-2 py-1 text-xs text-center">{log.item_name}</td>
                                                <td className="px-2 py-1 text-xs text-center">{log.action}</td>
                                                <td className="px-2 py-1 text-xs text-center">{quantityValue}</td>
                                                <td className="px-2 py-1 text-xs text-center">{buyerName}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeSideTab === "quick" && (
                        <div>
                            <h3 className="text-lg text-gray-800 mb-2">Quick Actions</h3>
                            <div className="space-y-3">
                                {
                                    user.role === "admin" ? (
                                        <>
                                            <button
                                                onClick={() => navigate("/inventory/add")}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                                                style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                                            >
                                                Add Inventory
                                            </button>
                                            <button
                                                onClick={() => navigate("/logs/allot")}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                                                style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                                            >
                                                Sell Item
                                            </button>
                                            <button
                                                onClick={() => navigate("/logs/return")}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                                                style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                                            >
                                                Return Item
                                            </button>
                                            {user?.role === "admin" && (
                                                <button
                                                    onClick={() => navigate("/create-user")}
                                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all"
                                                    style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                                                >
                                                    Create User
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => navigate("/logs/allot")}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                                                style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                                            >
                                                Sell Item
                                            </button>
                                            <button
                                                onClick={() => navigate("/logs/return")}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                                                style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                                            >
                                                Return Item
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default SidePanel;