import { Injectable, computed, signal } from '@angular/core';
import { DemoSession, DemoUser } from '../models/auth-user.model';

const USERS_STORAGE_KEY = 'workflova.demo.users';
const SESSION_STORAGE_KEY = 'workflova.demo.session';

@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  private readonly session = signal<DemoSession | null>(this.readSession());

  readonly currentSession = this.session.asReadonly();
  readonly isAuthenticated = computed(() => this.session() !== null);

  signup(email: string, password: string): DemoSession {
    const normalizedEmail = email.trim().toLowerCase();
    const users = this.readUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const nextUser: DemoUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    this.writeUsers([...users, nextUser]);
    return this.persistSession(nextUser);
  }

  login(email: string, password: string): DemoSession {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.readUsers().find(
      (entry) => entry.email === normalizedEmail && entry.password === password,
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    return this.persistSession(user);
  }

  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.session.set(null);
  }

  private persistSession(user: DemoUser): DemoSession {
    const nextSession: DemoSession = {
      userId: user.id,
      email: user.email,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    this.session.set(nextSession);
    return nextSession;
  }

  private readUsers(): DemoUser[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as DemoUser[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeUsers(users: DemoUser[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  private readSession(): DemoSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as DemoSession;
      if (!parsed?.userId || !parsed?.email) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}
