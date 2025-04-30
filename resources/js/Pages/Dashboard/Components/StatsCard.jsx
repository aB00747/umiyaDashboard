// Pages/Dashboard/StatsCard.jsx
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
// import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/outline";


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function StatsCard() {
    const stats = [
        {
            name: "Total Revenue",
            stat: "₹24,89,500",
            previousStat: "₹22,15,800",
            change: "12.4%",
            changeType: "increase",
        },
        {
            name: "Production Output",
            stat: "12,850 L",
            previousStat: "11,900 L",
            change: "8.0%",
            changeType: "increase",
        },
        {
            name: "New Orders",
            stat: "38",
            previousStat: "40",
            change: "5.0%",
            changeType: "decrease",
        },
        {
            name: "Inventory Levels",
            stat: "85%",
            previousStat: "78%",
            change: "7.0%",
            changeType: "increase",
        },
    ];

    return (
        <div className="mb-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6"
                    >
                        <dt className="truncate text-sm font-medium text-gray-500">
                            {item.name}
                        </dt>
                        <dd className="mt-1">
                            <div className="flex items-baseline">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {item.stat}
                                </p>
                                <p
                                    className={classNames(
                                        item.changeType === "increase"
                                            ? "text-green-600"
                                            : "text-red-600",
                                        "ml-2 flex items-baseline text-sm font-semibold"
                                    )}
                                >
                                    {item.changeType === "increase" ? (
                                        <ArrowUpIcon
                                            className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ArrowDownIcon
                                            className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="ml-1">{item.change}</span>
                                    <span className="sr-only">
                                        {" "}
                                        {item.changeType === "increase"
                                            ? "Increased"
                                            : "Decreased"}{" "}
                                        by{" "}
                                    </span>
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                vs. previous month ({item.previousStat})
                            </p>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
