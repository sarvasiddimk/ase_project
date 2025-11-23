import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const jobs = [
    {
      id: 'JOB-1001',
      customer: 'Alice Smith',
      vehicle: '2018 Toyota Camry',
      status: 'IN_PROGRESS',
      time: '10:00 AM',
      description: 'Oil Change & Brake Inspection',
    },
    {
      id: 'JOB-1002',
      customer: 'Bob Jones',
      vehicle: '2020 Ford F-150',
      status: 'PENDING',
      time: '11:30 AM',
      description: 'Check Engine Light Diagnosis',
    },
    {
      id: 'JOB-1003',
      customer: 'Charlie Brown',
      vehicle: '2019 Honda Civic',
      status: 'COMPLETED',
      time: '09:00 AM',
      description: 'Tire Rotation',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Technician Dashboard</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Jobs Today" value="5" icon={<Calendar className="text-blue-500" />} />
        <StatCard title="In Progress" value="1" icon={<Clock className="text-orange-500" />} />
        <StatCard title="Completed" value="2" icon={<CheckCircle className="text-green-500" />} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-700">Today's Schedule</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{job.vehicle}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(job.status)}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{job.customer} • {job.description}</div>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {job.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-gray-50 rounded-full">
        {icon}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
    case 'PENDING': return 'bg-orange-100 text-orange-700';
    case 'COMPLETED': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
