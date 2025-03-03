import React, { useEffect, useState } from 'react';
import BetModal from '../../components/BetModal';
import { useJwt } from '../../providers/JwtProvider';
import Button from '../../components/Button';
import axios from 'axios';

interface Event {
  event_id: string;
  event_name: string;
  odds: string;
}

const SportsEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {token} = useJwt();

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data.events || []);
    } catch (error) {
      import.meta.env.MODE === 'development' && console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePlaceBet = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <h1 className="text-2xl mb-4 text-center text-orange-400">Sports Events</h1>
      <p className="text-sm md:text-base text-white text-center mb-4">Here you can view the available sports events and place your bets.</p>
      
      {/* Table for Events */}
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-700 text-orange-400">
            <th className="py-1 sm:py-2 text-left px-2 sm:px-4">Event Name</th>
            <th className="py-1 sm:py-2 text-center px-2 sm:px-4">Odds</th>
            <th className="py-1 sm:py-2 text-center px-2 sm:px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.event_id} className="border-b border-gray-600">
              <td className="py-1 sm:py-2 px-2 sm:px-4 text-white">{event.event_name}</td>
              <td className="py-1 sm:py-2 px-2 sm:px-4 text-center text-orange-400">{event.odds}</td>
              <td className="py-1 sm:py-2 px-2 sm:px-4 text-center">
                <Button
                  onClick={() => handlePlaceBet(event)}
                >
                  Place Bet
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedEvent && (
        <BetModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
      )}
  </>
  );
};

export default SportsEvents; 