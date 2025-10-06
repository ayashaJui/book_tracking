import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ReadingLog, ReadingLogFilters, ReadingStats, ReadingSessionLog } from '../models/reading-log.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingLogService {
  private apiUrl = '/api/user-books'; // Your backend API endpoint
  private readingLogsSubject = new BehaviorSubject<ReadingLog[]>([]);
  public readingLogs$ = this.readingLogsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ===== CRUD Operations =====

  /**
   * Get all reading logs for the current user
   */
  getReadingLogs(filters?: ReadingLogFilters): Observable<ReadingLog[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.searchQuery) params = params.set('search', filters.searchQuery);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.authors && filters.authors.length > 0) {
        params = params.set('authors', filters.authors.join(','));
      }
      if (filters.dateRange?.startDate) {
        params = params.set('startDate', filters.dateRange.startDate.toISOString());
      }
      if (filters.dateRange?.endDate) {
        params = params.set('endDate', filters.dateRange.endDate.toISOString());
      }
      if (filters.rating) params = params.set('rating', filters.rating.toString());
      if (filters.readingFormat) params = params.set('format', filters.readingFormat);
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<ReadingLog[]>(this.apiUrl, { params }).pipe(
      tap(logs => this.readingLogsSubject.next(logs))
    );
  }

  /**
   * Get a specific reading log by ID
   */
  getReadingLog(id: number): Observable<ReadingLog> {
    return this.http.get<ReadingLog>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new reading log
   */
  createReadingLog(readingLog: Omit<ReadingLog, 'id' | 'createdAt' | 'updatedAt'>): Observable<ReadingLog> {
    return this.http.post<ReadingLog>(this.apiUrl, readingLog).pipe(
      tap(newLog => {
        const currentLogs = this.readingLogsSubject.value;
        this.readingLogsSubject.next([...currentLogs, newLog]);
      })
    );
  }

  /**
   * Update an existing reading log
   */
  updateReadingLog(id: number, updates: Partial<ReadingLog>): Observable<ReadingLog> {
    return this.http.put<ReadingLog>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedLog => {
        const currentLogs = this.readingLogsSubject.value;
        const index = currentLogs.findIndex(log => log.id === id);
        if (index !== -1) {
          currentLogs[index] = updatedLog;
          this.readingLogsSubject.next([...currentLogs]);
        }
      })
    );
  }

  /**
   * Delete a reading log
   */
  deleteReadingLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentLogs = this.readingLogsSubject.value;
        const filteredLogs = currentLogs.filter(log => log.id !== id);
        this.readingLogsSubject.next(filteredLogs);
      })
    );
  }

  // ===== Status Management =====

  /**
   * Update reading status (e.g., start reading, finish book)
   */
  updateReadingStatus(id: number, status: ReadingLog['status'], additionalData?: {
    startDate?: Date;
    finishDate?: Date;
    currentPage?: number;
    progressPercentage?: number;
  }): Observable<ReadingLog> {
    const updates: Partial<ReadingLog> = { status, ...additionalData };
    return this.updateReadingLog(id, updates);
  }

  /**
   * Update reading progress
   */
  updateProgress(id: number, currentPage: number, progressPercentage?: number): Observable<ReadingLog> {
    const updates: Partial<ReadingLog> = { 
      currentPage,
      progressPercentage,
      updatedAt: new Date()
    };
    return this.updateReadingLog(id, updates);
  }

  // ===== Statistics =====

  /**
   * Get reading statistics for the user
   */
  getReadingStats(): Observable<ReadingStats> {
    return this.http.get<ReadingStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Get reading stats for a specific time period
   */
  getReadingStatsByPeriod(startDate: Date, endDate: Date): Observable<ReadingStats> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<ReadingStats>(`${this.apiUrl}/stats`, { params });
  }

  // ===== Filtering Helpers =====

  /**
   * Get logs by status
   */
  getLogsByStatus(status: ReadingLog['status']): Observable<ReadingLog[]> {
    return this.getReadingLogs({ status });
  }

  /**
   * Get currently reading books
   */
  getCurrentlyReading(): Observable<ReadingLog[]> {
    return this.getLogsByStatus('currently_reading');
  }

  /**
   * Get finished books
   */
  getFinishedBooks(): Observable<ReadingLog[]> {
    return this.getLogsByStatus('read');
  }

  /**
   * Get want to read books
   */
  getWantToRead(): Observable<ReadingLog[]> {
    return this.getLogsByStatus('want_to_read');
  }

  // ===== Session Tracking =====

  /**
   * Log a reading session
   */
  logReadingSession(session: Omit<ReadingSessionLog, 'id' | 'createdAt'>): Observable<ReadingSessionLog> {
    return this.http.post<ReadingSessionLog>(`${this.apiUrl}/sessions`, session);
  }

  /**
   * Get reading sessions for a book
   */
  getReadingSessions(userBookId: number): Observable<ReadingSessionLog[]> {
    return this.http.get<ReadingSessionLog[]>(`${this.apiUrl}/${userBookId}/sessions`);
  }

  // ===== Import/Export =====

  /**
   * Import reading logs from file (CSV, Goodreads, etc.)
   */
  importReadingLogs(file: File, format: 'csv' | 'goodreads' | 'json'): Observable<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    
    return this.http.post<{ imported: number; errors: string[] }>(`${this.apiUrl}/import`, formData);
  }

  /**
   * Export reading logs
   */
  exportReadingLogs(format: 'csv' | 'json' | 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  // ===== Bulk Operations =====

  /**
   * Bulk update multiple reading logs
   */
  bulkUpdateReadingLogs(updates: Array<{ id: number; data: Partial<ReadingLog> }>): Observable<ReadingLog[]> {
    return this.http.put<ReadingLog[]>(`${this.apiUrl}/bulk`, { updates }).pipe(
      tap(updatedLogs => {
        const currentLogs = this.readingLogsSubject.value;
        const updatedLogsMap = new Map(updatedLogs.map(log => [log.id, log]));
        
        const newLogs = currentLogs.map(log => 
          updatedLogsMap.has(log.id) ? updatedLogsMap.get(log.id)! : log
        );
        
        this.readingLogsSubject.next(newLogs);
      })
    );
  }

  /**
   * Search logs with advanced filters
   */
  searchReadingLogs(query: string, filters?: ReadingLogFilters): Observable<ReadingLog[]> {
    const searchFilters = { ...filters, searchQuery: query };
    return this.getReadingLogs(searchFilters);
  }
}