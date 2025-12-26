
import React, { useState } from 'react';
import { MinusCircle, PlusCircle, Trash2, Wand2, ChevronUp, ArrowDownCircle, StickyNote } from 'lucide-react';
import { Goal } from './types';
import { EditableText } from './EditableText';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onDelete: (id: string) => void;
  onAIAction?: (goal: Goal) => void;
  onCopyToToday?: (text: string) => void;
  onPromoteUp?: (text: string) => void;
  colorTheme?: {
    primary: string;
    light: string;
    bg: string;
    border: string;
  };
}

export const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onUpdate, 
  onDelete, 
  onAIAction, 
  onCopyToToday,
  onPromoteUp,
  colorTheme = {
    primary: 'text-indigo-600',
    light: 'bg-indigo-50',
    bg: 'bg-indigo-500',
    border: 'border-indigo-100'
  }
}) => {
  const [showMemo, setShowMemo] = useState(false);
  
  const updateProgress = (delta: number) => {
    const next = Math.max(0, Math.min(100, (goal.progress || 0) + delta));
    onUpdate(goal.id, { progress: next, completed: next === 100 });
  };

  return (
    <div className={`group bg-white rounded-xl sm:rounded-2xl border ${colorTheme.border} p-4 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-3`}>
      {/* 첫 번째 줄: 텍스트와 삭제 버튼 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <EditableText 
            value={goal.text} 
            onSave={(text) => onUpdate(goal.id, { text })} 
            strikethrough={goal.completed}
            className={`text-base sm:text-lg font-black leading-tight ${colorTheme.primary} break-words`}
          />
        </div>
        <button 
          onClick={() => onDelete(goal.id)} 
          className="p-1.5 text-slate-100 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
          title="삭제"
        >
          <Trash2 size={18}/>
        </button>
      </div>

      {/* 두 번째 줄: 기능 버튼들과 진행상황 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-1.5 ${colorTheme.light} p-1 rounded-xl border ${colorTheme.border}`}>
          {onPromoteUp && (
            <button 
              onClick={() => onPromoteUp(goal.text)}
              className={`p-1.5 text-slate-300 hover:${colorTheme.primary} transition-colors`}
              title="상위 목표로 이동/복사"
            >
              <ChevronUp size={18} strokeWidth={2.5} />
            </button>
          )}
          {onCopyToToday && (
            <button 
              onClick={() => onCopyToToday(`[Focus] ${goal.text}`)}
              className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
              title="오늘의 할 일로 복사"
            >
              <ArrowDownCircle size={18} strokeWidth={2.5} />
            </button>
          )}
          <button 
            onClick={() => setShowMemo(!showMemo)}
            className={`p-1.5 transition-colors ${goal.memo ? `${colorTheme.primary} ${colorTheme.light} rounded-lg` : `text-slate-300 hover:${colorTheme.primary}`}`}
            title="메모"
          >
            <StickyNote size={18} strokeWidth={2.5} />
          </button>
          {onAIAction && (
            <>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button 
                onClick={() => onAIAction(goal)}
                className={`p-1.5 text-slate-300 hover:${colorTheme.primary} transition-colors`}
                title="AI로 단계 나누기"
              >
                <Wand2 size={18} />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 min-w-[200px] flex items-center gap-3">
          <div className={`flex-1 h-1.5 ${colorTheme.light} rounded-full overflow-hidden`}>
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${goal.completed ? 'bg-emerald-500' : colorTheme.bg}`} 
              style={{ width: `${goal.progress}%` }} 
            />
          </div>
          <div className={`flex items-center gap-1 ${colorTheme.light} p-1 rounded-xl border ${colorTheme.border} shrink-0`}>
            <button onClick={() => updateProgress(-10)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><MinusCircle size={16}/></button>
            <span className={`text-xs font-black ${colorTheme.primary} tabular-nums w-8 text-center`}>{goal.progress}%</span>
            <button onClick={() => updateProgress(10)} className="p-1 text-slate-300 hover:text-emerald-500 transition-colors"><PlusCircle size={16}/></button>
          </div>
        </div>
      </div>
      
      {/* 메모 영역 */}
      {showMemo && (
        <div className="animate-in slide-in-from-top-2 pt-2">
          <textarea 
            autoFocus
            placeholder="목표에 대한 상세 내용을 입력하세요..."
            className={`w-full ${colorTheme.light} border ${colorTheme.border} rounded-2xl p-4 text-base font-medium outline-none min-h-[100px] focus:ring-4 focus:ring-${colorTheme.light} transition-all`}
            value={goal.memo || ""}
            onChange={(e) => onUpdate(goal.id, { memo: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};
