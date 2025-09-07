import DashboardHeader from '../../sections/app/dashboard/DashboardHeader';
import DashboardStats from '../../sections/app/dashboard/DashboardStats';
import DashboardCharts from '../../sections/app/dashboard/DashboardCharts';
import RecentActivity from '../../sections/app/dashboard/RecentActivity';
import QuickActions from '../../sections/app/dashboard/QuickActions';

function DashboardView() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats />
      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

export default DashboardView;
