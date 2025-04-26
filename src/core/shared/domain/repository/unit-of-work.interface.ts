import { Transaction } from 'sequelize';

export interface IUnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;

  getTransaction(): Transaction | null;

  do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}
