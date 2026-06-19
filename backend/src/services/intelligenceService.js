class IntelligenceService {
  async getAdvisories() {
    // Mock data based on real CERT-In style
    return [
      {
        id: 'CIAD-2024-0042',
        title: 'Vulnerabilities in Google Chrome',
        severity: 'High',
        date: '2024-10-15',
        source: 'CERT-In',
        link: 'https://www.cert-in.org.in/'
      },
      {
        id: 'CIAD-2024-0039',
        title: 'Multiple Vulnerabilities in Microsoft Products',
        severity: 'Critical',
        date: '2024-10-11',
        source: 'CERT-In',
        link: 'https://www.cert-in.org.in/'
      }
    ];
  }

  async getComplianceGuidance(role) {
    const common = [
      { title: 'IT (Intermediary Guidelines) Rules', type: 'Regulation' },
      { title: 'Digital Personal Data Protection Act (DPDP)', type: 'Act' }
    ];

    if (role === 'government') {
      return [...common, { title: 'National Cyber Security Policy', type: 'Policy' }];
    }

    if (role === 'legal') {
      return [...common, { title: 'Cyber Crime Reporting Standard Operating Procedure', type: 'SOP' }];
    }

    return common;
  }
}

module.exports = new IntelligenceService();
