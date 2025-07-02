
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import SubjectForm from '@/components/SubjectForm';

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectAdded: (subject: any) => void;
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubjectAdded
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 modal-3d"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-3d card-3d">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
          <h3 
            id="subject-form-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Add New Subject
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-8 w-8 p-0 btn-3d"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-6">
              <SubjectForm onAddSubject={(subject) => {
                onSubjectAdded(subject);
                onClose();
              }} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SubjectFormModal;
