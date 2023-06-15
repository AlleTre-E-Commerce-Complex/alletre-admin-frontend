import React from "react";
import { Table } from "semantic-ui-react";

const UsersTable = () => {
  return (
    <div className="animate-in">
      <Table className="bg-transparent border-none px-5 pt-8  ">
        <Table.Header>
          <Table.Row className="rounded-xl shadow bg-[#F8F8F8]">
            <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-center">
              name
            </Table.HeaderCell>
            <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
              blaa
            </Table.HeaderCell>
            <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
              blaa
            </Table.HeaderCell>
            <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
              blaa
            </Table.HeaderCell>
            <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-center ">
              blaa
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {/* 
      {totalBids?.map((e, index) => ( */}
        <Table.Body className="my-2 cursor-pointer">
          <div className="my-2"></div>
          <Table.Row
            // onClick={() => {
            //   setUserID(e?.id);
            //   setOpenSecondModel(true);
            // }}
            className="bg-background border-none shadow rounded-lg "
          >
            <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg ">
              blaa
            </Table.Cell>
            <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
              blaa
            </Table.Cell>
            <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
              blaa
            </Table.Cell>
            <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
              blaa
            </Table.Cell>
            <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg ">
              blaa
            </Table.Cell>
          </Table.Row>
        </Table.Body>
        {/* ))} */}
      </Table>
    </div>
  );
};

export default UsersTable;
