import React, { useState } from 'react';
import { Modal, Form, Button, Radio, Input, TextArea, Checkbox } from 'semantic-ui-react';

const WalletManagementModal = ({ open, onClose, userBalance, isAdmin }) => {
  const modalStyle = {
    backgroundColor: '#FEFEFE',
  };
  console.log("www", isAdmin)
  const headerStyle = {
    backgroundColor: '#a91d3a',
    color: 'white',
    borderBottom: 'none',
    padding: '1.5rem',
    fontSize: '1.25rem',
    fontWeight: '600'
  };

  const contentStyle = {
    padding: '2rem',
    backgroundColor: '#F9F9F9'
  };

  const inputStyle = {
    '& input': {
      backgroundColor: 'white',
      border: '1px solid #E5E5E5'
    }
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    fontWeight: '500'
  };
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [adminChanges, setAdminChanges] = useState(false);

  const handleSubmit = () => {
    // Handle the form submission here
    console.log({
      transactionType,
      amount: Number(amount) || 0,
      description,
      auctionId: Number(auctionId) || 0,
      adminChanges
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      style={modalStyle}
      className="rounded-lg shadow-xl"
    >
      <Modal.Header style={headerStyle}>Manage Wallet</Modal.Header>
      <Modal.Content style={contentStyle}>
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-veryLight">
          <p className="text-gray-dark font-medium">Current Balance:
            <span className="text-primary ml-2 text-lg font-bold">{userBalance} AED</span>
          </p>
        </div>

        <Form.Field className="mb-6">
          <label className="text-gray-verydark font-medium mb-2 block">Auction ID</label>
          <Input
            type="number"
            value={auctionId}
            onChange={(e) => setAuctionId(Number(e.target.value))}
            className="w-full"
            style={inputStyle}
          />
        </Form.Field>
        <Form onSubmit={handleSubmit}>
          <Form.Field className="mb-6">
            <label className="text-gray-verydark font-medium mb-2 block">Transaction Type</label>
            <Form.Group inline>
              <Form.Field>
                <Radio
                  label="Deposit"
                  value="deposit"
                  checked={transactionType === 'deposit'}
                  onChange={(e, { value }) => setTransactionType(value)}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Withdrawal"
                  value="withdrawal"
                  checked={transactionType === 'withdrawal'}
                  onChange={(e, { value }) => setTransactionType(value)}
                />
              </Form.Field>
            </Form.Group>
          </Form.Field>

          <Form.Field className="mb-6">
            <label className="text-gray-verydark font-medium mb-2 block">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}

              required
              className="w-full"
              style={inputStyle}
              icon={{ name: 'money bill alternate ', color: 'grey' }}
              iconPosition="left"
            />
          </Form.Field>

          <Form.Field className="mb-6">
            <label className="text-gray-verydark font-medium mb-2 block">Description</label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full"
              style={{ backgroundColor: 'white', border: '1px solid #E5E5E5' }}
            />
          </Form.Field>


          {!isAdmin && <Form.Field className="mt-8">
            <Checkbox
              label={<label className="text-gray-dark">Make admin-side changes</label>}
              checked={adminChanges}
              onChange={(e, { checked }) => setAdminChanges(checked)}
              className="text-primary"
            />
          </Form.Field>}
        </Form>
      </Modal.Content>
      <Modal.Actions className="bg-gray-light p-4 flex justify-end gap-3">
        <Button
          onClick={onClose}
          style={{ ...buttonStyle, backgroundColor: '#6F6F6F', color: 'white' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ ...buttonStyle, backgroundColor: '#a91d3a', color: 'white' }}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default WalletManagementModal;
