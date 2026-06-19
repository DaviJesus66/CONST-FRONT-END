import styles from './styles.module.css';
import { useTaskContext } from '../../context/TaskContext';

export function CountDown() {
  const { state } = useTaskContext();
  return (
    <div className={styles.container}>{state.formattedSecondsRemaining}</div>
  );
}