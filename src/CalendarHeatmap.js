import React, { useState, useEffect } from 'react';
import './CalendarHeatmap.css';

const CalendarHeatmap = () => {
  const [data, setData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetch("StreamingHistory2024.json")
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  if (!data) return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="music-icon">🎵</div>
        <span>Loading your Listening History...</span>
      </div>
    </div>
  );

  const { year, data: monthsData } = data;
  const orderedMonths = Object.keys(monthsData).sort((a, b) => parseInt(a) - parseInt(b));

  const getIntensityClass = (totalSongs) => {
    if (totalSongs < 1) return 'intensity-1';
    if (totalSongs < 10) return 'intensity-2';
    if (totalSongs < 20) return 'intensity-3';
    if (totalSongs < 30) return 'intensity-4';
    if (totalSongs < 40) return 'intensity-5';
    return 'intensity-6';
  };

  return (
    <div className="music-heatmap-container">
      <div className="heatmap-wrapper">
        <div className="header">
          <h1>
            My Year in Music {year}
          </h1>
        </div>

        <div className="months-grid">
          {orderedMonths.map((month) => {
            const days = monthsData[month];
            const firstDayOfMonth = new Date(year, parseInt(month) - 1, 1).getDay();
            const orderedDays = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b));

            return (
              <div key={month} className="month-card">
                <h2 className="month-name">
                  {new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long' })}
                </h2>
                <div className="days-grid">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="empty-day" />
                  ))}
                  {orderedDays.map((day) => {
                    const dayData = days[day];
                    const { totalSongs } = dayData;
                    const intensityClass = getIntensityClass(totalSongs);
                    const isSelected = selectedDay === `${month}-${day}`;

                    return (
                      <div
                        key={day}
                        className={`day ${intensityClass} ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDay(isSelected ? null : `${month}-${day}`)}
                        title={`${totalSongs} songs played 
Top Track: ${dayData.mostPlayedSong}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <div className="day-details-overlay">
            <div className="day-details-container">
              {(() => {
                const [month, day] = selectedDay.split('-');
                const dayData = monthsData[month][day];
                return (
                  <div className="day-details-content">
                    <h3>Details for {month}/{day}/{year}</h3>
                    <div className="details-grid">
                      <div className="detail-card">
                        <p className="detail-label">Songs Played</p>
                        <p className="detail-value">{dayData.totalSongs}</p>
                      </div>
                      <div className="detail-card">
                        <p className="detail-label">Top Track</p>
                        <p className="detail-value most-played">{dayData.mostPlayedSong}</p>
                      </div>
                      <div className="detail-card full-width">
                        <p className="detail-label">Total Listening Time</p>
                        <p className="detail-value">{dayData.totalDuration} mins</p>
                      </div>
                    </div>
                    <button 
                      className="close-details-btn" 
                      onClick={() => setSelectedDay(null)}
                    >
                      Close
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarHeatmap;