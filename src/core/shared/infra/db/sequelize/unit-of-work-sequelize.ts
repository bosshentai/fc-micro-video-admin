import { Sequelize, Transaction } from 'sequelize';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work.interface';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';

export class UnitOfWorkSequelize implements IUnitOfWork {
  private transaction: Transaction | null;

  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();
  constructor(private sequelize: Sequelize) {}

  async start(): Promise<void> {
    if (!this.transaction) {
      this.transaction = await this.sequelize.transaction();
    }
  }

  async commit(): Promise<void> {
    this.validateTransaction();
    await this.transaction!.commit();
    this.transaction = null;
  }

  async rollback(): Promise<void> {
    this.validateTransaction();
    await this.transaction!.rollback();
    this.transaction = null;
  }
  getTransaction() {
    return this.transaction;
  }
  async do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    let isAutoTransaction = false;

    try {
      if (this.transaction) {
        const result = await workFn(this);
        this.transaction = null;
        return result;
      }

      return await this.sequelize.transaction(async (t) => {
        isAutoTransaction = true;
        this.transaction = t;
        const result = await workFn(this);
        this.transaction = null;
        return result;
      });
    } catch (error) {
      if (!isAutoTransaction) {
        this.transaction?.rollback();
      }
      // this.tryRollback();
      this.transaction = null;
      throw error;
    }
  }

  private tryRollback() {
    try {
      if (this.transaction) {
        this.transaction.rollback();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private validateTransaction() {
    if (!this.transaction) {
      throw new Error('Transaction not started');
    }
  }

  addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }

  getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }
}
