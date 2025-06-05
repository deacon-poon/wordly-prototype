export interface MobileGuidelineProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const MobileGuideline: React.FC<MobileGuidelineProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      <div className="space-y-8">{children}</div>
    </div>
  );
};

export interface GuidelineSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const GuidelineSection: React.FC<GuidelineSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export interface ImplementationGuideProps {
  platform: string;
  requirements: string[];
  notes?: string[];
  examples?: { label: string; value: string }[];
}

export const ImplementationGuide: React.FC<ImplementationGuideProps> = ({
  platform,
  requirements,
  notes,
  examples,
}) => {
  return (
    <div className="border-l-4 border-primary-teal-500 pl-4 py-2">
      <h4 className="font-medium text-gray-900 mb-2">{platform}</h4>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-1">
            Requirements:
          </h5>
          <ul className="text-sm text-gray-600 space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {examples && examples.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-1">
              Examples:
            </h5>
            <div className="space-y-1">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 flex justify-between"
                >
                  <span>{example.label}:</span>
                  <span className="font-mono text-xs bg-gray-100 px-1 rounded">
                    {example.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {notes && notes.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-1">Notes:</h5>
            <ul className="text-sm text-gray-500 space-y-1">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">*</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export interface SizingStandardProps {
  component: string;
  description: string;
  specifications: {
    property: string;
    value: string;
    notes?: string;
  }[];
  touchTarget?: {
    minimum: string;
    recommended: string;
    notes?: string;
  };
}

export const SizingStandard: React.FC<SizingStandardProps> = ({
  component,
  description,
  specifications,
  touchTarget,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900">{component}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Specifications:
          </h5>
          <div className="space-y-2">
            {specifications.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{spec.property}:</span>
                <div className="text-right">
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                    {spec.value}
                  </span>
                  {spec.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {spec.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {touchTarget && (
          <div className="border-t border-gray-200 pt-3">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Touch Target:
            </h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum:</span>
                <span className="font-mono text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                  {touchTarget.minimum}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recommended:</span>
                <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                  {touchTarget.recommended}
                </span>
              </div>
              {touchTarget.notes && (
                <p className="text-xs text-gray-500 mt-2">
                  {touchTarget.notes}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
