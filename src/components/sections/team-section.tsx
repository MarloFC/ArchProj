"use client"

import { Linkedin, Instagram, Mail } from "lucide-react"

interface TeamMember {
  id: string
  name: string | null
  role: string | null
  imageUrl: string | null
  linkedin: string | null
  instagram: string | null
  email: string | null
  order: number
}

interface TeamSectionProps {
  teamMembers: TeamMember[]
  gradientFrom: string
  gradientTo: string
  accentColor: string
  secondaryColor: string
  teamTitle: string
  teamSubtitle: string
  teamDescription: string
}

export function TeamSection({
  teamMembers,
  gradientFrom,
  gradientTo,
  accentColor,
  secondaryColor,
  teamTitle,
  teamSubtitle,
  teamDescription,
}: TeamSectionProps) {
  return (
    <main className="min-h-screen pt-24 pb-20" style={{ backgroundColor: accentColor }}>
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-left mt-20 mb-36 max-w-3xl mx-auto md:mx-20">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
            }}
          >
            {teamTitle}
          </h1>
          <p className="text-xl mb-4" style={{ color: secondaryColor }}>
            {teamSubtitle}
          </p>
          <div
            className="text-base prose prose-sm max-w-none"
            style={{ color: secondaryColor }}
            dangerouslySetInnerHTML={{ __html: teamDescription }}
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto md:mx-20">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              gradientFrom={gradientFrom}
              gradientTo={gradientTo}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

function TeamMemberCard({ member, gradientFrom, gradientTo, index }: any) {
  return (
    <div
      className="group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl border border-gray-100"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
        background:"whitesmoke"
      }}
    >
      {/* Gradient Border Effect on Hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Image Container */}
      <div className="relative mb-6 mx-auto w-32 h-32 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
          }}
        />
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {member.name}
        </h3>
        <p
          className="text-sm font-medium mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
          }}
        >
          {member.role}
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-3">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
                e.currentTarget.querySelector('svg')?.classList.add('text-white')
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`
                e.currentTarget.querySelector('svg')?.classList.remove('text-white')
              }}
            >
              <Linkedin className="w-5 h-5 transition-colors duration-300" style={{ color: gradientFrom }} />
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
                e.currentTarget.querySelector('svg')?.classList.add('text-white')
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`
                e.currentTarget.querySelector('svg')?.classList.remove('text-white')
              }}
            >
              <Instagram className="w-5 h-5 transition-colors duration-300" style={{ color: gradientFrom }} />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
                e.currentTarget.querySelector('svg')?.classList.add('text-white')
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`
                e.currentTarget.querySelector('svg')?.classList.remove('text-white')
              }}
            >
              <Mail className="w-5 h-5 transition-colors duration-300" style={{ color: gradientFrom }} />
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
