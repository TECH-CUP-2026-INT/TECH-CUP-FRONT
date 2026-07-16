declare module '@/components/TournamentCalendar' {
  const TournamentCalendar: React.FC
  export default TournamentCalendar
}
declare module '@/components/CalendarFilters' {
  const CalendarFilters: React.FC
  export default CalendarFilters
}
declare module '@/components/UpcomingMatches' {
  const UpcomingMatches: React.FC
  export default UpcomingMatches
}
declare module '@/components/TechCupRoleSelector' {
  interface TechCupRoleSelectorProps {
    onContinue?: (role: string) => void
  }
  const TechCupRoleSelector: React.FC<TechCupRoleSelectorProps>
  export default TechCupRoleSelector
}
