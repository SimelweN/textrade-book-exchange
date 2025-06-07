import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookFormData } from "@/types/book";

interface BookInformationFormProps {
  formData: BookFormData;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const BookInformationForm = ({
  formData,
  errors,
  onInputChange,
}: BookInformationFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-base font-medium">
          Book Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder="Enter book title"
          className={errors.title ? "border-red-500" : ""}
          required
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="author" className="text-base font-medium">
          Author <span className="text-red-500">*</span>
        </Label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={onInputChange}
          placeholder="Enter author name"
          className={errors.author ? "border-red-500" : ""}
          required
        />
        {errors.author && (
          <p className="text-sm text-red-500 mt-1">{errors.author}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Describe the book's content and condition"
          rows={4}
          className={errors.description ? "border-red-500" : ""}
          required
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
    </div>
  );
};
