import { curriculumData, getCurriculumStageClass } from '@/lib/curriculum-data';
import { Slider } from '@/components/ui/slider';

interface AgeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function AgeSlider({ value, onChange }: AgeSliderProps) {
  const curriculumInfo = curriculumData[value];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">
          Age: <span className="text-[hsl(248,84%,67%)] font-semibold">{value} year{value !== 1 ? 's' : ''}</span>
        </label>
        <span className={`curriculum-badge ${getCurriculumStageClass(curriculumInfo.stage)}`}>
          {curriculumInfo.stage}
        </span>
      </div>
      
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={12}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>3</span>
          <span>6</span>
          <span>9</span>
          <span>12</span>
        </div>
      </div>
      
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 font-medium">{curriculumInfo.title}</p>
        <p className="text-xs text-green-700 mt-1">{curriculumInfo.description}</p>
      </div>
    </div>
  );
}
