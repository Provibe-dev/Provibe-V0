-- Insert mock documents into project_documents table
INSERT INTO project_documents (
  id,
  project_id,
  title,
  type,
  content,
  status,
  created_at,
  updated_at
)
VALUES
(
  'doc-1',
  'mock-project-1',
  'Product Requirements Document',
  'prd',
  '# Product Requirements Document

## Overview

### Product Name
Mobile App Documentation

### Product Summary
A comprehensive mobile app for managing personal finances and investments

### Objectives
- Solve: The difficulty of tracking multiple financial accounts, investments, and spending habits in one place
- Improve user experience
- Improve user experience

### Target Audience
Young professionals aged 25-40 who are looking to better manage their finances and investments

## Goals & Success Metrics

### Goals
- Achieve market adoption
- Achieve market adoption

### Success Metrics
- User engagement rate
- User engagement rate

## Features & Functionality

### Core Features
1. Expense tracking
2. Investment portfolio management
3. Financial goal setting

### Future Enhancements
- Future improvement
- Future improvement

## Technical Requirements

### Platform
Mobile (iOS and Android)

### Technologies
- React Native
- Node.js

### Integration Points
- Third-party service
- Third-party service

## Timeline & Milestones

### Phase 1
- Development milestone
- Development milestone

### Phase 2
- Development milestone
- Development milestone',
  'completed',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'doc-2',
  'mock-project-1',
  'User Flow',
  'user_flow',
  '# User Flow

## Overview
This document outlines the primary user journeys for Mobile App Documentation.

## User Journey 1: User Registration

### Trigger
User clicks ''Sign Up'' button

### Steps
1. User completes form
2. System processes request
3. User completes form
4. System processes request

### End State
User is registered and logged in

## User Journey 2: User Registration

### Trigger
User clicks ''Sign Up'' button

### Steps
1. User completes form
2. System processes request
3. User completes form
4. System processes request

### End State
User is registered and logged in

## Error Flows

### Error Flow 1: Form Validation Error
System displays validation errors and allows correction',
  'completed',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  'doc-3',
  'mock-project-1',
  'Architecture Document',
  'architecture',
  '# Architecture Document

## Overview
This document outlines the technical architecture for Mobile App Documentation.

## Tech Stack

### Frontend
- React Native
- Custom component library
- Redux

### Backend
- Node.js
- Express
- JWT

### Database
- MongoDB
- Prisma

### Infrastructure
- Vercel
- GitHub Actions
- Datadog

## System Architecture

### Component Diagram
Microservices architecture with API Gateway

### Data Flow
1. Data processing step
2. Data processing step
3. Data processing step

## Security Considerations

- Input validation and sanitization
- Input validation and sanitization

## Scalability Strategy

- Horizontal scaling with load balancing
- Horizontal scaling with load balancing',
  'completed',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);