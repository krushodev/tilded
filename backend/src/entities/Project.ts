import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '@/entities/User';
import { Task } from '@/entities/Task';
import { Section } from '@/entities/Section';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  color!: string;

  @Column({ default: false, type: 'boolean' })
  isFavorite!: boolean;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, user => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Task, task => task.project)
  tasks!: Task[];

  @OneToMany(() => Section, section => section.project)
  sections!: Section[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

