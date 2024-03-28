const formatDuration = (duration) => {
    const hours = Math.floor(duration / 1000 / 60 / 60);
    const minutes = Math.floor(duration / 1000 / 60) % 60;
    const seconds = Math.floor(duration / 1000) % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default formatDuration;