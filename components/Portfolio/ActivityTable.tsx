/* eslint-disable react/jsx-key */
import React from "react"
import { useTable, useSortBy } from "react-table"
import {
    Link,
} from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { TableContent } from "./PositionsTable"
import { Position } from "./PositionsTable"
import data from "../../pages/api/users.json"

// TODO: add sorting table column function using react-table
// example: https://codesandbox.io/s/mjk1v?file=/src/makeData.js:19-24

const ActivityTable = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Market',
                accessor: 'user',
                Cell: function MarketCell(data: any) {
                    return <Position data={data} />
                },
            },
            {
                Header: 'Amount',
            },
            {
                Header: 'Action',
            },
            {
                Header: 'Time',
            },
            {
                Header: 'Tx',
                accessor: 'role',
                Cell: function MarketCell(data: any) {
                    return <Link href="#"><ExternalLinkIcon /></Link>
                },
            },
        ],
        []
    );

    return (
        <TableContent columns={columns} data={data} />
    );
}

export default ActivityTable
