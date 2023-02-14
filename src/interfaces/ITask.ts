export default interface ITask {
  name: string;
  isSelectedFrom: boolean;
  isSelectedTo: boolean;
  isInitial: boolean;
  isFinal: boolean;
  isOrphan: boolean;
}
