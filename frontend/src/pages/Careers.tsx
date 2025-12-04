import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, ChevronRight } from 'lucide-react';
import rolesService from '../services/roles.service';

interface JobRole {
  id: number;
  title: string;
  role_type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  department: string;
  created_at: string;
}

const Careers: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await rolesService.getPublicJobRoles();
        setJobRoles(response.data);
      } catch (error) {
        console.error('Failed to fetch job roles', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Explore exciting career opportunities and become part of our growing team of professionals
          </p>
        </div>

        {/* Job Listings */}
        {jobRoles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {jobRoles.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-white/10 glass-panel p-6 shadow-glow hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-primary" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        Full-time
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary border border-primary/30">
                    Open
                  </span>
                </div>

                <p className="text-text-secondary mb-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Requirements Preview */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Key Requirements:
                    </h3>
                    <ul className="space-y-1">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                          <span className="line-clamp-1">{req}</span>
                        </li>
                      ))}
                      {job.requirements.length > 3 && (
                        <li className="text-sm text-text-secondary/70 italic">
                          +{job.requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <Link
                  to={`/careers/${job.id}/apply`}
                  className="inline-flex items-center justify-center w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background shadow-glow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                >
                  Apply Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-text-secondary" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No open positions
            </h3>
            <p className="mt-2 text-text-secondary">
              Check back later for new opportunities
            </p>
          </div>
        )}

        {/* Why Join Us Section */}
        <div className="mt-16 rounded-xl border border-white/10 glass-panel p-8 shadow-glow">
          <h2 className="text-2xl font-bold text-white mb-6">
            Why Join PlanMorph?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="font-semibold text-white mb-2">
                Professional Growth
              </h3>
              <p className="text-sm text-text-secondary">
                Continuous learning opportunities and career advancement
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                Collaborative Environment
              </h3>
              <p className="text-sm text-text-secondary">
                Work with talented professionals across multiple disciplines
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                Competitive Benefits
              </h3>
              <p className="text-sm text-text-secondary">
                Comprehensive compensation and benefits package
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
