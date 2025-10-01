import { useNavigate } from 'react-router-dom';
import TeamsTable from '@/sections/app/management/teams/TeamsTable';
import { Team } from '@/apis/services/teamApi';

function TeamsView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/management/teams/create');
  };

  const handleEdit = (team: Team) => {
    navigate(`/management/teams/${team.id}/edit`);
  };

  return (
    <div className="p-6">
      <TeamsTable onEdit={handleEdit} onCreate={handleCreate} />
    </div>
  );
}

export default TeamsView;
