import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import FormField from './FormField';
import { useJwt } from '../providers/JwtProvider';
import axios from 'axios';

interface BetModalProps {
  event: {
    event_id: string;
    event_name: string;
    odds: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const BetModal: React.FC<BetModalProps> = ({ event, isOpen, onClose }) => {
  const [betAmount, setBetAmount] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { token } = useJwt();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    try {
      await axios.post(`/api/events/${event.event_id}/bets`, {
        bet_amount: betAmount,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to place bet");
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setBetAmount('');
    setError('');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError('');
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setBetAmount(value);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {!isSuccess ? (
        <>
          <h2 className="text-lg md:text-xl text-orange-400 mb-4">Place Your Bet</h2>
          <p className="text-sm md:text-base text-white mb-4">Event: {event.event_name}</p>
          <p className="text-sm md:text-base text-white mb-4">Odds: {event.odds}</p>
          <form onSubmit={handleSubmit}>
            <FormField
              type="text"
              placeholder="Enter amount"
              value={betAmount}
              onChange={handleChange}
              error={error}
              required
            />
            <Button type="submit" fullWidth>
              Confirm Bet
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-lg md:text-xl text-orange-400 mb-4">Bet Placed Successfully!</h2>
          <p className="text-sm md:text-base text-white mb-6">
            You have placed a bet of ${betAmount} on {event.event_name}
          </p>
          <Button onClick={handleClose} fullWidth>
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default BetModal; 