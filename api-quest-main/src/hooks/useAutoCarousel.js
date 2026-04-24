import { useState, useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const useAutoCarousel = (data, intervalTime = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because 0 is the clone
  const flatListRef = useRef(null);
  const totalItems = data.length + 2; // Original + 2 clones

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };

  const handleMomentumScrollEnd = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    let newIndex = Math.round(offset / width);

    // Infinite Loop Logic:
    // If we hit the clone of the last item (index 0), jump to real last item
    if (newIndex === 0) {
      newIndex = data.length;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    } 
    // If we hit the clone of the first item (index last), jump to real first item
    else if (newIndex === data.length + 1) {
      newIndex = 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    }

    setCurrentIndex(newIndex);
  };

  return {
    flatListRef,
    handleMomentumScrollEnd,
    initialScrollIndex: 1, 
  };
};