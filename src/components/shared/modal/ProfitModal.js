import React, { useEffect, useState } from 'react';
import { Modal, Table, Button } from 'semantic-ui-react';
import { authAxios } from '../../../config/axios-config';
import useAxios from '../../../hooks/use-axios';
import api from '../../../api';

const ProfitModal = ({ open, onClose }) => {
  const { run, isLoading } = useAxios();
  const [profitData, setProfitData] = useState([])
  useEffect(() => {
    if (!open) return;
  
    run(
      authAxios
        .get(api.app.adminWallet.getAdminAllProfitData)
        .then((res) => {
          setProfitData(res?.data?.profitData || []);
        })
        .catch((error) => {
          console.log(error);
        })
    );
  }, [open]);
  
  return (
    <Modal open={open} onClose={onClose} size="large">
      <Modal.Header>Profit Transactions</Modal.Header>
      <Modal.Content scrolling>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {profitData.map((profit) => (
              <Table.Row key={profit.id}>
                <Table.Cell>{new Date(profit.createdAt).toLocaleString()}</Table.Cell>
                <Table.Cell>{profit.description}</Table.Cell>
                <Table.Cell>AED {parseFloat(profit.amount).toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} color="black">Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ProfitModal;
